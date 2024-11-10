import styled from '@emotion/styled';
import Link from 'next/link';
// import { NF_IMAGE_LOADER } from '../components/BlurImage';

export const Header = styled('div')`
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 700px) {
    flex-direction: column;
    & > * + * {
      margin-top: 20px;
    }
    div {
      align-items: center !important;
    }
  }
`;
export const Contact = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
export const Title = styled('div')`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  font-size: 18pt;
  align-items: center;
  margin-bottom: 10px;
  h2.subtitle {
    margin-top: 5px;
    font-variant: normal;
    font-weight: normal;
    font-size: 15px;
  }
`;

export const CV = styled('div')`
  // padding:50px;
  font-weight: 300;
  // padding:20px;
  // padding-bottom:0;
  font-size: 15px;
  line-height: 1.5;

  h2 {
    text-align: left;
    font-size: 14pt;
    font-variant: small-caps;
    margin-top: 0px;
    margin-bottom: 5px;
  }
  h3 {
    text-align: left;
    font-size: 12pt;
  }
  div.content {
    clear: both;
    margin-top: 0px;
    padding-top: 20px;
    padding-bottom: 0;
  }
  div.block {
    margin-top: 0px;
    margin-bottom: 20px;
    padding-left: 30px;
    padding-top: 0px;
  }
  span.flabel {
    font-style: italic;
    margin-right: 5px;
  }
  span.em {
    font-weight: bold;
  }
  span.pubTitle {
    font-style: italic;
  }
  span.wtime {
    font-style: italic;
  }
  ul {
    margin-top: 0;
    margin-bottom: 0;
    list-style: circle;
    li {
      margin: 0 0 0 2em;
    }
    & > li + li {
      margin-top: 0.75em;
    }
  }

  .notitles ul {
    // padding-left: 18px;
  }

  div.jobTitle {
    margin: 0 0 10px 0;
    padding: 0;
  }
`;

export const Go = ({ to, children }) => (
  <a href={to} target="_blank" rel="noopener">
    {children}
  </a>
);


export const Talk = ({ children }) => <li>{children}</li>;

export const TalkTitle = ({ href, children }) => (
  <span className="pubTitle">
    {href ? <Link href={href}>{children}</Link> : children}
  </span>
);

export const TalkVenue = ({ url, children }) => (
  url ? <Go to={url}>{children}</Go> : <>{children}</>
);

export const ResumeSection = ({ title, children }) => (
  <>
    <h2>{title}</h2>
    <div className="block">
      {children}
    </div>
  </>
);
