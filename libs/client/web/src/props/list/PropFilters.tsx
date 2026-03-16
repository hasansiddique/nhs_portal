import React from 'react';
import { Accordion } from 'react-bootstrap-accordion';
import { ActiveFilterProps } from './Props';
import { SvgCloseIcon } from '@your-props/client/icons';

export const PropFilters = ({
  filtersList,
  showFilters,
  appliedFilters,
  handleOnFilterClick,
  setShowFilters,
  resetFilters,
}: {
  filtersList: any;
  appliedFilters: any;
  showFilters: boolean;
  handleOnFilterClick: any;
  setShowFilters: any;
  resetFilters: any;
}) => {
  const matchWidth = window.matchMedia('(min-width: 992px)');

  return showFilters ? (
    <div className="col-xl-3 col-lg-4 col-md-12 mb-[40px]">
      <div
        id="side-bar"
        className="side-bar bg-[#3939394d] pb-[20px] rounded-[10px]"
      >
        <div
          className="flex flex-row justify-between items-center px-[40px] py-[16px]"
          style={{ borderBottom: '2px solid #393939' }}
        >
          <div className="text-[20px] leading-[26px] font-bold">Filter</div>
          <div className="flex items-center gap-6 lg:gap-0">
            <div
              className="text-[14px] text-[#EF6A3B] font-bold leading-[22px] cursor-pointer"
              onClick={resetFilters}
            >
              Reset
            </div>
            <div
              className="close-filter cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SvgCloseIcon fill="#f1f1f1" />
            </div>
          </div>
        </div>

        {filtersList?.productSaleTypes?.length ? (
          <div className="widget widget-category boder-bt mx-[40px] pt-[40px]">
            <div className="content-wg-category">
              <Accordion title="Listing Type" show={true}>
                <div className="flex flex-wrap gap-2 pb-[40px]">
                  {filtersList?.productSaleTypes?.map(
                    (item: ActiveFilterProps) => {
                      const isChecked = appliedFilters.findIndex(
                        (f: ActiveFilterProps) =>
                          f.value === item.id && f.filterType === 'sale_type'
                      );

                      return (
                        <div
                          key={item.id}
                          className={`text-[16px] leading-[24px] font-[700] mb-[8px]`}
                        >
                          <div
                            onClick={() =>
                              handleOnFilterClick({
                                filterType: 'sale_type',
                                value: item.id,
                                name: item.name,
                              })
                            }
                            className={`${
                              isChecked > -1 ? 'bg-[#ef6a3b]' : 'bg-[#393939]'
                            } px-[14px] py-[8px] hover:cursor-pointer hover:text-white rounded-2xl active:bg-[#EF6A3B]`}
                          >
                            {item.name}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </Accordion>
            </div>
          </div>
        ) : null}

        {filtersList?.productCategories?.length ? (
          <div className="widget widget-category boder-bt mx-[40px] mt-[40px]">
            <div className="content-wg-category">
              <Accordion title="Categories" show={matchWidth.matches}>
                <form action="#" className="pb-[40px]">
                  {filtersList?.productCategories?.map(
                    (item: ActiveFilterProps) => {
                      const isChecked = appliedFilters.findIndex(
                        (f: ActiveFilterProps) =>
                          f.value === item.id && f.filterType === 'category'
                      );

                      return (
                        <div
                          key={item.id}
                          className="flex justify-between flex-row pb-2"
                        >
                          <span className="text-[18px] font-semibold leading-[26px] capitalize">
                            {item.name}
                          </span>
                          <label className="mt-[4px] mb-0 !pl-[20px]">
                            <input
                              onChange={() =>
                                handleOnFilterClick({
                                  filterType: 'category',
                                  value: item.id,
                                  name: item.name,
                                })
                              }
                              checked={isChecked > -1}
                              value={item.id}
                              type="checkbox"
                              className="!w-[20px] !h-[20px]"
                            />
                            <span className="btn-checkbox !w-[20px] !h-[20px]"></span>
                          </label>
                        </div>
                      );
                    }
                  )}
                </form>
              </Accordion>
            </div>
          </div>
        ) : null}

        {filtersList?.productTypes?.length ? (
          <div className="widget widget-category boder-bt mb-[40px] mx-[40px] mt-[40px]">
            <div className="content-wg-category">
              <Accordion title="Type" show={matchWidth.matches}>
                <form action="#" className="pb-[40px]">
                  {filtersList?.productTypes?.map((item: ActiveFilterProps) => {
                    const isChecked = appliedFilters.findIndex(
                      (f: ActiveFilterProps) =>
                        f.value === item.id && f.filterType === 'type'
                    );

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between flex-row pb-2"
                      >
                        <span className="text-[18px] font-semibold leading-[26px] capitalize">
                          {item.name}
                        </span>
                        <label className="mt-[4px] mb-0 !pl-[20px]">
                          <input
                            onChange={() =>
                              handleOnFilterClick({
                                filterType: 'type',
                                value: item.id,
                                name: item.name,
                              })
                            }
                            checked={isChecked > -1}
                            value={item.id}
                            type="checkbox"
                            className="!w-[20px] !h-[20px]"
                          />
                          <span className="btn-checkbox !w-[20px] !h-[20px]"></span>
                        </label>
                      </div>
                    );
                  })}
                </form>
              </Accordion>
            </div>
          </div>
        ) : null}

        {filtersList?.collections?.length ? (
          <div className="widget widget-category border-b-0 mb-[0px] mx-[40px] mt-[40px]">
            <div className="content-wg-category">
              <Accordion title="Collections" show={matchWidth.matches}>
                <form action="#" className="mb-0">
                  {filtersList?.collections?.map((item: ActiveFilterProps) => {
                    const isChecked = appliedFilters.findIndex(
                      (f: ActiveFilterProps) =>
                        f.value === item.id && f.filterType === 'collections'
                    );

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between flex-row pb-2"
                      >
                        <span className="text-[18px] font-semibold leading-[26px] capitalize">
                          {item.name}
                        </span>
                        <label className="mt-[4px] mb-0 !pl-[20px]">
                          <input
                            onChange={() =>
                              handleOnFilterClick({
                                filterType: 'collections',
                                value: item.id,
                                name: item.name,
                              })
                            }
                            checked={isChecked > -1}
                            value={item.id}
                            type="checkbox"
                            className="!w-[20px] !h-[20px]"
                          />
                          <span className="btn-checkbox !w-[20px] !h-[20px]"></span>
                        </label>
                      </div>
                    );
                  })}
                </form>
              </Accordion>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};
