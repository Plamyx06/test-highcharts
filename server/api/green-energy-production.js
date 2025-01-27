export default defineEventHandler(async () => {
  const API_ENDPOINT =
    "https://data.enedis.fr/api/explore/v2.1/catalog/datasets/production-electrique-par-filiere-a-la-maille-region/records";
  const LIMIT = 100;
  const ORDER_BY = "annee";
  const allData = [];

  try {
    const firstResponse = await $fetch(API_ENDPOINT, {
      params: { order_by: ORDER_BY, limit: LIMIT, offset: 0 },
    });

    const total = firstResponse.total_count;

    const totalRequest = Math.ceil(total / LIMIT);

    const requests = [];
    for (let index = 0; index < totalRequest; index++) {
      const offset = index * LIMIT;
      requests.push(
        $fetch(API_ENDPOINT, {
          params: { order_by: ORDER_BY, limit: LIMIT, offset },
        })
      );
    }

    const results = await Promise.all(requests);
    for (const response of results) {
      if (response && response.results) {
        allData.push(...response.results);
      }
    }
    const groupedByYear = allData.reduce((acc, results) => {
      const year = results.annee;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(results);
      return acc;
    }, {});

    return {
      success: true,
      total,
      dataGroupedByYear: groupedByYear,
    };
  } catch (error) {
    console.error("error:", error);
  }
});
