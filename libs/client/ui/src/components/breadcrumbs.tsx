import { Link } from 'react-router-dom';
import * as React from 'react';

import { SvgChevronRight } from '@your-props/client/icons';

export const Breadcrumbs = ({
  breadCrumbs,
}: {
  breadCrumbs: { label: string; isActive: boolean; redirectUrl?: string }[];
}) => (
  <div className="pt-[100px] bg-[#222222]">
    <div className="themesflat-container sm:h-[40px] md:h-[80px] flex flex-row items-center">
      <div className="flex flex-wrap items-center">
        {breadCrumbs.map((breadCrumb, index) => (
          <div className="flex items-center" key={index}>
            {breadCrumb.redirectUrl ? (
              <Link to={breadCrumb.redirectUrl}>
                <h5
                  className={`text-[22px] leading-[28px] cursor-pointer capitalize ${
                    breadCrumb.isActive
                      ? 'font-bold text-white'
                      : 'font-semibold text-[#676767]'
                  }`}
                >
                  {breadCrumb.label}
                </h5>
              </Link>
            ) : (
              <h5
                className={`text-[22px] leading-[28px]  capitalize ${
                  breadCrumb.isActive
                    ? 'font-bold text-white'
                    : 'font-medium text-[#676767]'
                }`}
              >
                {breadCrumb.label}
              </h5>
            )}
            {index !== breadCrumbs.length - 1 && (
              <span className="mx-[6px]">
                <SvgChevronRight height={24} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
