/**
 * useMockTime — returns timezone-aware mock time data.
 * Signature matches future real API hook for drop-in replacement.
 * Does NOT use setInterval — ticking is the renderer's job.
 *
 * @param {string[]} zones — array of IANA timezone strings
 * @returns {{ data: { zones: Array<{id: string, name: string, offset: string}> }, loading: false, error: null }}
 */
function useMockTime(zones = ['Europe/Moscow']) {
  const now = new Date();

  const zoneData = zones.map((zone) => {
    // Get short timezone name (e.g., "MSK", "GMT")
    const nameFormatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: zone,
      timeZoneName: 'short',
    });
    const nameParts = nameFormatter.formatToParts(now);
    const namePart = nameParts.find((p) => p.type === 'timeZoneName');
    const name = namePart ? namePart.value : zone;

    // Compute UTC offset string (e.g., "UTC+3")
    const offsetFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      timeZoneName: 'shortOffset',
    });
    const offsetParts = offsetFormatter.formatToParts(now);
    const offsetPart = offsetParts.find((p) => p.type === 'timeZoneName');
    const offset = offsetPart ? offsetPart.value.replace('GMT', 'UTC') : 'UTC';

    return { id: zone, name, offset };
  });

  return {
    data: { zones: zoneData },
    loading: false,
    error: null,
  };
}

export default useMockTime;
