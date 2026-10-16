import { GATEWAY_ENDPOINT } from '../axios.config';

/**
 * A campus. Mirrors `backend/src/modules/institutions/schemas/institution.schema.ts`
 * and the contract in `marketplace/mobile/docs/INSTITUTIONS.md`.
 *
 * `_id`, `name`, `shortName`, `slug`, `city`, `state`, `country`, `branding` and
 * `supportedAppTypes` are always present — they are what `GET /institutions`
 * projects. The geo/contact fields only come back from the single-campus
 * endpoint (`GET /institutions/:idOrSlug`), so they are optional here.
 */
export interface InstitutionBranding {
  /** Hex colour, e.g. `#FF5C1A`. Lets a campus theme itself later. */
  primaryColor?: string;
  tagline?: string;
  logoUrl?: string;
}

/** GeoJSON point. Coordinates are `[longitude, latitude]` — GeoJSON order. */
export interface InstitutionCenter {
  type: 'Point';
  coordinates: [number, number];
}

/** The app variants a campus supports (build variants, not backend roles). */
export type InstitutionAppType = 'student' | 'vendor' | 'dispatch';

export interface Institution {
  _id: string;
  /** Full name, e.g. `College of Medicine, University of Lagos`. */
  name: string;
  /** `CMUL` — shown in chips and badges. */
  shortName: string;
  /** `cmul` — unique, lowercase, URL-safe; the stable public key. */
  slug: string;
  city: string;
  state: string;
  country: string;
  /** Campus centre. Detail endpoint only. */
  center?: InstitutionCenter;
  /** Delivery radius in km (backend default 8). Detail endpoint only. */
  deliveryRadiusKm?: number;
  /** Inactive campuses are hidden from the picker. */
  isActive?: boolean;
  branding: InstitutionBranding;
  /** Subset of `['student', 'vendor', 'dispatch']`. */
  supportedAppTypes: InstitutionAppType[];
  contactPhone?: string;
  contactEmail?: string;
}

/**
 * Reads a campus reference off a value that may be a plain ObjectId/slug string
 * (`user.institution`) or a populated document (`user.institution._id`).
 *
 * Returns `''` when there is no campus, which is the signal to send no
 * `X-Institution-Id` header and render no campus row — the backend then keeps
 * its previous unscoped behaviour.
 */
export const institutionRefFrom = (value: unknown): string => {
  if (!value) return '';
  const raw = typeof value === 'object'
    ? ((value as any)._id || (value as any).slug)
    : value;
  return typeof raw === 'string' ? raw.trim() : '';
};

export const institutions_api = {
  /** Active campuses (public). Never returns inactive ones. */
  list: () => {
    return GATEWAY_ENDPOINT.get('/institutions');
  },

  /** One campus, full detail (public). Accepts an ObjectId or a slug. */
  get: (idOrSlug: string) => {
    return GATEWAY_ENDPOINT.get(`/institutions/${idOrSlug}`);
  },
};
