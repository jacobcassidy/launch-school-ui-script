# Todos

- [] Create screenshot of the various view, with hotkeys used to toggle those views.
  - [] Book Page
    - [] Header + Sidebar + Content + Tabs Panel (all layout sections showing)
    - [] Header + Content + Tabs Panel
    - [] Content + Tabs Panel
    - [] Content
    - [] Header + Table of Contents Menu
    - [] Header + Hotkeys Menu
  - [] Logged-out home page
  - [] Exercise Page
    - Header + Sidebar + Editor + Tabs Panel
    - Header + Editor + Tabs Panel
    - Editor + Tabs Panel

- [] Show how to use the script with the Tampermonkey extension.

- [] Create Hotkeys Menu with:
  - [] All Pages
    - [] Toggle Header
    - [] Toggle Sidebar
    - [] Toggle Hotkeys Menu
  - [] All Pages with Tabs
    - [] Focus Tab #
    - [] Focus Editor/Scratchpad panel
    - [] Copy Editor/Scratchpad code
  - [] Book Page
    - [] Toggle Tabs Panel
    - [] Toggle Table of Contents
  - [] Exercise Page
    - [] Toggle exercise as complete/incomplete
    - [] Go to next exercise
    - [] Submit solution for LSBot Review

- [] Create Hotkeys toggle button with a svg icon for site-header that toggles the visibility of the Hotkeys menu (can use the existing, but hidden settings menu).

- [] Add note on how to change the border colors if more or less contrast is desired.

- [] Update hotkeys menu to only show the hotkeys available on the current page
  - hotkeys.js
    - injectHotkeysMenu()
      - createHotkeysMenuSection()
    - syncAvailableHotkeys()
      - updateHotkeysMenu
      - setAvailableHotkey()

  - eventListeners
    - runHotkey()

- injectHeader()
  - createHeader()
    - injectHeaderContainers()
      - createHeaderContainer()
        - injectContainerElements()
          - injectSidebarShowButton()
            - createSidebarShowButton()
          - moveLoggedOutNavToHeader()
          - injectTitleToHeaderWithNoBreadcrumbs()
            - createHeaderTitle()
          - injectTabsPanelToggleButton()
            - createTabsPanelToggleButton()
          - injectSettingsMenuToggleButton()
            - createSettingsMenuToggleButton()
          - injectSettingsMenu()
            - createSettingsMenu()
  - injectContainerStyleOffsets()
