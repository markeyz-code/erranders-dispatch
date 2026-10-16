import { ref } from 'vue';
import { institutions_api, type Institution } from '@/api_factory/modules/institutions';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config';

export const INSTITUTION_KEY = 'errandr_dispatch_institution';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

interface StoredInstitution {
  institution: Institution;
  hasChosen: boolean;
}

const institution = ref<Institution | null>(null);
const institutions = ref<Institution[]>([]);
const isLoading = ref(false);
const hasChosen = ref(false);
const pickerRequested = ref(false);
const splashTarget = ref<Institution | null>(null);
let restored = false;

const isInstitution = (value: unknown): value is Institution => {
  const candidate = value as Partial<Institution> | null | undefined;
  return (
    !!candidate &&
    typeof candidate === 'object' &&
    typeof candidate._id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.slug === 'string'
  );
};

const institutionKey = (inst: Institution | null | undefined): string =>
  inst?._id || inst?.slug || '';

export const getSelectedInstitutionId = (): string | null => {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp(`(^| )${INSTITUTION_KEY}=([^;]+)`));
    if (match) return decodeURIComponent(match[2]).trim() || null;
    const stored = window.localStorage.getItem(INSTITUTION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.institution?._id || parsed?.institution?.slug || null;
    }
    return null;
  } catch {
    return null;
  }
};

const persistSelection = (inst: Institution | null) => {
  const id = institutionKey(inst);

  if (typeof document !== 'undefined') {
    try {
      document.cookie = id
        ? `${INSTITUTION_KEY}=${encodeURIComponent(id)}; max-age=${MAX_AGE_SECONDS}; path=/; SameSite=Lax`
        : `${INSTITUTION_KEY}=; max-age=0; path=/; SameSite=Lax`;
    } catch (err) {
      console.warn('[institution] Could not persist dispatch campus cookie:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      if (inst) {
        const payload: StoredInstitution = { institution: inst, hasChosen: true };
        window.localStorage.setItem(INSTITUTION_KEY, JSON.stringify(payload));
      } else {
        window.localStorage.removeItem(INSTITUTION_KEY);
      }
    } catch (err) {
      console.warn('[institution] Could not persist dispatch selected campus:', err);
    }
  }
};

const readStored = (): StoredInstitution | null => {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(INSTITUTION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && isInstitution(parsed.institution)) {
        return {
          institution: parsed.institution,
          hasChosen: parsed.hasChosen !== false,
        };
      }
    } catch (err) {
      console.warn('[institution] Could not read stored campus:', err);
    }
  }
  return null;
};

const loadInstitutions = async (): Promise<void> => {
  isLoading.value = true;
  try {
    const res: any = await institutions_api.list();
    const payload = res?.data ?? res?.value;
    const raw: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.institutions)
        ? payload.institutions
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

    institutions.value = raw.filter(
      (inst) => isInstitution(inst) && inst.isActive !== false
    );
  } catch (err) {
    console.warn('[institution] Could not load campuses:', err);
  } finally {
    isLoading.value = false;
  }
};

const hydrateSelection = async (idOrSlug: string): Promise<void> => {
  try {
    const res: any = await institutions_api.get(idOrSlug);
    if (res?.type === 'ERROR') return;
    const payload = res?.data ?? res?.value;
    const doc = payload?.institution ?? payload;
    if (isInstitution(doc)) {
      institution.value = doc;
      persistSelection(doc);
    }
  } catch (err) {
    console.warn('[institution] Could not rehydrate selected campus:', err);
  }
};

const switchInstitution = async (inst: Institution): Promise<void> => {
  if (!isInstitution(inst)) return;

  splashTarget.value = inst;
  isLoading.value = true;

  try {
    // Pin to user on backend if authenticated
    try {
      await GATEWAY_ENDPOINT_WITH_AUTH.patch('/users/me/institution', {
        institutionId: institutionKey(inst),
      });
    } catch (err) {
      console.warn('[institution] Could not pin campus on server; keeping locally:', err);
    }

    institution.value = inst;
    hasChosen.value = true;
    pickerRequested.value = false;
    persistSelection(inst);
  } finally {
    isLoading.value = false;
  }
};

const restore = (): void => {
  if (restored) return;
  restored = true;

  const stored = readStored();
  if (stored) {
    institution.value = stored.institution;
    hasChosen.value = stored.hasChosen;
    return;
  }

  // Check user in localStorage
  if (typeof window !== 'undefined') {
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u?.institution) {
          const instRef = typeof u.institution === 'object' ? (u.institution._id || u.institution.slug) : u.institution;
          if (instRef) {
            hasChosen.value = true;
            void hydrateSelection(instRef);
            return;
          }
        }
      }
    } catch (e) {}
  }

  const id = getSelectedInstitutionId();
  if (id) {
    hasChosen.value = true;
    void hydrateSelection(id);
  }
};

const openPicker = (): void => {
  pickerRequested.value = true;
  if (institutions.value.length === 0) void loadInstitutions();
};

const closePicker = (): void => {
  pickerRequested.value = false;
};

const endCampusSwitch = (): void => {
  splashTarget.value = null;
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

export const useInstitution = () => ({
  institution,
  institutions,
  isLoading,
  hasChosen,
  loadInstitutions,
  switchInstitution,
  restore,
  pickerRequested,
  openPicker,
  closePicker,
  splashTarget,
  endCampusSwitch,
});
