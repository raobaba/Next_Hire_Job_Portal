import React from "react";
import { Helmet } from "react-helmet";

const ReactHelmet = ({ title, description, canonicalUrl }) => {
  // Get base URL from environment variable or use current origin as fallback
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || import.meta.env.VITE_CLIENT_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  
  // If canonicalUrl is a relative path, prepend base URL
  const fullCanonicalUrl = canonicalUrl 
    ? (canonicalUrl.startsWith('http') 
        ? canonicalUrl 
        : `${baseUrl}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`)
    : null;
  
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
    </Helmet>
  );
};

export default ReactHelmet;
