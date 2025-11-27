import React from "react";
import { Helmet } from "react-helmet";

const ReactHelmet = ({ title, description, canonicalUrl }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default ReactHelmet;
