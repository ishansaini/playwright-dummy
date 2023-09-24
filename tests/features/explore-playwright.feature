Feature: Simple counter
  User wants to use counter to increase or decrease the number on screen

  Scenario: Explore playwright.dev
    Given User visits playwright homepage
    When User clicks on "GET STARTED" button 
    Then User is able to navigate to community tab

  Scenario: Discover playwright documentation
    Given User visits playwright homepage
    When User is able to navigate to docs tab
    Then User is able to navigate to expand integrations
    