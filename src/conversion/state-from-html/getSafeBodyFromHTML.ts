const getSafeBodyFromHTML = (html: string) => {
  if (document.implementation && document.implementation.createHTMLDocument) {
    const doc = document.implementation.createHTMLDocument("foo");
    doc.documentElement.innerHTML = html;
    return doc.getElementsByTagName("body")[0];
  }
};

export default getSafeBodyFromHTML;
