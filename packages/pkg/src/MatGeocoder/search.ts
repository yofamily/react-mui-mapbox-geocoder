export enum SearchApis {
  geocoding = 'geocoding',
  searchbox = 'searchbox',
}

export default async function search(
  endpoint: string,
  searchApi: SearchApis,
  source: string,
  accessToken: string,
  sessionToken: string,
  query: string,
  onResult: (err: any, res: Response | null, searchTime: Date) => void,
  proximity?: {longitude: number; latitude: number},
  country?: string,
  bbox?: number[],
  types?: string,
  limit?: number,
  autocomplete?: boolean,
  language?: string
) {
  const searchTime = new Date();
  try {
    var baseUrl
    if (searchApi == SearchApis.geocoding) {
      baseUrl = `${endpoint}/geocoding/v5/${source}/${query}.json`;
    } else if (searchApi == SearchApis.searchbox) {
      baseUrl = `${endpoint}/search/searchbox/v1/suggest`;
    } else {
      console.error(`search(): unexpected searchApi value`, searchApi)
    }
    // Don't send empty query params to Mapbox geocoding api.
    const searchParams = {
      ...(searchApi == SearchApis.searchbox && {q: query, session_token: sessionToken}),
      ...(isNotNil(accessToken) && {access_token: accessToken}),
      ...(isNotNil(proximity) && {
        proximity:
          proximity && Object.keys(proximity).length === 2
            ? `${proximity.longitude},${proximity.latitude}`
            : null,
      }),
      ...(isNotNil(bbox) && {
        bbox: bbox && bbox.length > 0 ? bbox.join(',') : null,
      }),

      ...(isNotNil(types) && {
        types,
      }),
      ...(isNotNil(country) && {
        country,
      }),
      ...(isNotNil(limit) && {
        limit,
      }),
      ...(isNotNil(autocomplete) && {
        autocomplete,
      }),
      ...(isNotNil(language) && {
        language,
      }),
    };
    const url = `${baseUrl}?${toUrlString(searchParams)}`;
    const res = await fetch(url);
    const data = await res.json();
    onResult(null, data, searchTime);
    return {err: null, res, searchTime};
  } catch (err) {
    onResult(err, null, searchTime);
    return {err, res: null, searchTime};
  }
}

function toUrlString(params: any) {
  return Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    )
    .join('&');
}

function isNotNil(value: unknown) {
  return value !== undefined && value !== null;
}
export async function retrieveFeature(
  featureId: string,
  endpoint: string,
  accessToken: string,
  sessionToken: string,
) {
  const searchTime = new Date();
  try {
    const baseUrl = `${endpoint}/search/searchbox/v1/retrieve/${featureId}`;
    const searchParams = {
      access_token: accessToken, session_token: sessionToken,
    }
    const url = `${baseUrl}?${toUrlString(searchParams)}`;
    const res = await fetch(url);
    const data = await res.json();
    return {err: null, feature: data && data.features && data.features[0], searchTime};
  } catch (err) {
    return {err, res: null, searchTime};
  }
}
