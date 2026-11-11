## Author: Preetham Lanka
## Date : 10th Nov 2026
## Bottom Nav Bar :
 - Created a bottom nav bar in E:\GatedPlus\GP-Mobile\working\src\components\BottomNavBar.tsx and using the component in the pages. 
 - example in @src\pages\HomePage.tsx: 
 {/* BOTTOM NAVIGATION */}
      <BottomNavBar
        activeTab="home"
        onTabPress={(tab) => {
          if (tab.key === 'sell') handleAction("Sell Property");
          else if (tab.key === 'search') handleAction("Search");
          else if (tab.key === 'activity') handleAction("Activity");
        }}
      />

    - the complete style of the nav bar with icons, theme, menu, settings, are handled in the component with routes /pages, /menu, /settings  