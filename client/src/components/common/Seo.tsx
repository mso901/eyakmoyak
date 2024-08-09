import { MetaHTMLAttributes } from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: MetaHTMLAttributes<HTMLMetaElement>['title'];
  description: MetaHTMLAttributes<HTMLMetaElement>['content'];
}

const defaultTitle = '이약뭐약';
const defaultDescription =
  '손쉬운 약검색부터 약 복용 관리까지, 이약뭐약에서 가능해요.';

const Seo = ({
  title = defaultTitle,
  description = defaultDescription
}: Partial<SeoProps>) => {
  const generateTitle = (title: SeoProps['title']) => {
    return title === defaultTitle ? defaultTitle : `${defaultTitle} | ${title}`;
  };

  const generateDescription = (description: SeoProps['description']) => {
    return description === defaultDescription
      ? defaultDescription
      : description;
  };

  const generateImage = () => {
    return {
      url: '/img/logo.png',
      width: '300',
      height: '106'
    };
  };

  const { url, width, height } = generateImage();

  return (
    <Helmet>
      <title>{generateTitle(title)}</title>
      <meta name='description' content={generateDescription(description)} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={generateTitle(title)} />
      <meta property='og:image' content={url} />
      <meta property='og:image:width' content={width} />
      <meta property='og:image:height' content={height} />
      <meta
        property='og:description'
        content={generateDescription(description)}
      />
      <meta property='og:locale' content='ko_KR' />
      <meta name='twitter:title' content={generateTitle(title)} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta
        name='twitter:description'
        content={generateDescription(description)}
      />
      <meta name='twitter:image' content={url} />
    </Helmet>
  );
};

export default Seo;
