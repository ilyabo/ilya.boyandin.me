import React from 'react';
import Image from 'next/image';
import markdownToHtml from '../lib/markdownToHtml';

const AboutPageTemplate = (props) => {
  const { title, body } = props;
  return (
    <div>
      <h1>{title}</h1>
      <div>
        <span dangerouslySetInnerHTML={{ __html: markdownToHtml(body) }}></span>
      </div>
    </div>
  );
};

export default AboutPageTemplate;
