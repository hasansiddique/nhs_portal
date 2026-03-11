import { ChevronRightDarkIcon, SvgCloseIcon } from '@your-props/client/icons';
import { useSidebarActions, useSidebarState } from '@your-props/client/utils';

export const DashboardRightSidebar = () => {
  const sidebarState = useSidebarState();
  const { openSidebar, closeSidebar } = useSidebarActions();

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.target as HTMLElement).id === 'sidebar-overlay') {
      closeSidebar();
    }
  };

  return sidebarState?.visible ? (
    <div
      id="sidebar-overlay"
      className="fixed inset-x-0 z-[100] bg-[#393939]/70 top-[80px] bottom-0"
      onClick={handleOutsideClick}
    >
      <div className="relative">
        <div
          className="absolute right-0 z-50 h-[calc(100vh-80px)] w-[100%] sm:w-[80%] sm:max-w-[510px] overflow-y-scroll rounded-[10px] border-[#222222] bg-[#222222] transition-[min-width]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-[20px] sm:px-[30px] pt-[20px] pb-[40px] sm:py-[40px] overflow-y-auto">
            <div className="flex justify-end">
              <button
                className="sm:hidden rounded-[50%] w-[25px] h-[25px] bg-[#676767] border-[#676767] py-[3px] px-[3px] hover:opacity-90"
                onClick={() => closeSidebar()}
              >
                <SvgCloseIcon width={18} height={18} fill="#C5B6B3" />
              </button>
            </div>
            {sidebarState?.content}
          </div>
        </div>

        <button
          className="hidden sm:block absolute right-[51rem] top-[4.5rem] z-50 bg-[#676767] border-[#676767] py-[10px] px-[2px] hover:opacity-90"
          style={{
            borderRadius: '10px 0px 0px 10px',
            borderLeft: '1px solid rgba(219, 219, 219, 0.30)',
          }}
          onClick={() => closeSidebar()}
        >
          <ChevronRightDarkIcon />
        </button>
      </div>
    </div>
  ) : null;
};
