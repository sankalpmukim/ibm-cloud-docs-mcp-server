/* eslint-disable valid-jsdoc */
const axios = require("axios");
const TOC_PREFIX = "/v4/toc";
const DOCS_CONTENT_ROUTE = `https://cloud.ibm.com/docs-content`;

/**
 * A function to return the subcollection and topicId if the URL is valid
 *
 * @param {string} url The url string to the docs page
 */
const processUrl = (url) => {
  const urlObject = new URL(url);

  return {
    subcollection: url.includes("/allowlist/")
      ? urlObject.pathname?.split("/")[3]
      : urlObject.pathname?.split("/")[2],
    topicId: urlObject.searchParams?.get("topic"),
  };
};

exports.fetchDocsContent = function (req, res, locale = "en") {
  const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const { subcollection, topicId } = processUrl(url);

  /**
   * Fetch and return the toc requested, or null if response is not valid
   * @param {string} subcollection
   * @param {string} locale
   */
  const fetchToc = async (location) => {
    if (!topicId) {
      return "";
    }

    const fetchOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    const tocUrl = `${DOCS_CONTENT_ROUTE}${location}?locale=${locale}`;
    try {
      const tocResponse = await axios.get(tocUrl, fetchOptions);
      if (tocResponse.status !== 200) {
        res.sendStatus(404);
        return "";
      }
      const tocJson = tocResponse.data;
      const topicData = tocJson.topics[topicId];
      const contentHref = topicData?.content;

      if (!topicData || !contentHref) {
        res.sendStatus(404);
        return "";
      }

      const contentResponse = await axios.get(
        `${DOCS_CONTENT_ROUTE}${contentHref.replace("/docs-content", "")}`,
        fetchOptions
      );
      if (contentResponse.status !== 200) {
        res.sendStatus(404);
        return "";
      }

      return contentResponse.data;
    } catch (err) {
      console.error("Fetch error: ", err);
      res.sendStatus(500);
      return "";
    }
  };

  return fetchToc(`${TOC_PREFIX}/${subcollection}`);
};
