import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalPath?: string;
}

const BASE_URL = 'https://botswanaandfriends.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={BASE_URL} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="BaFitD" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="geo.region" content="BW" />
      <meta name="geo.placename" content="Gaborone, Botswana" />
    </Helmet>
  );
};

export default PageSEO;
