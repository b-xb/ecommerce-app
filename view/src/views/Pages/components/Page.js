import React from 'react';

function Page({children}) {
  return (
    <article className="text-center py-5">
      {children}
    </article>
  );
}

export default Page;