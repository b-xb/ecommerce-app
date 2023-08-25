import React from 'react';

function PageTitle({title,dataTestId }) {
  return (
    <h1 data-testid={dataTestId}>{title}</h1>
  );
}

export default PageTitle;