import { NoContentPage } from '@your-props/client/ui';

export const NotFound = () => {
  return (
    <div className="themesflat-container">
      <div className="py-10 pt-40">
        <NoContentPage headingText="404" subText="Page not found"/>
      </div>
    </div>
  );
};
