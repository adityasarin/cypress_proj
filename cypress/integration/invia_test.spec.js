/// <reference types="Cypress" />

describe("user flow: search and book combo", ()=>{
    var name_hotel = '';
    var name_flight = '';
    //setup tests with opeing 
    before('Open the application url', () =>{
        cy.visit("https://www.ab-in-den-urlaub.de/", { timeout: 50000 })
        // clear cookies again after visiting to remove
        // any 3rd party cookies picked up such as cloudflare
        cy.clearCookies()
        // clear all local storage
        cy.clearLocalStorage()
    })
    
    it("Set filter criteria for search on home page", ()=>{
        //click on location textbox
        cy.get('.standard-version > #idestflat').click()
        //partially enter search text
        cy.get('.ac-box > .ac-item > #idestflat').type('Sizili')
        //default assertion for first result
        cy.get('.ac-box > .ac-item > .aiduac-wrapper > .aiduac-content > :nth-child(1) > .area > :nth-child(1) > ul > li > .aiduac-response-element > strong', {timeout: 6000}).click()
        //set von datepicker open
        cy.get('.datepicker-input-wrapper-start > .datepicker-trigger',{timeout: 6000}).click()
        //select next month from the datepicker control
        cy.get('.month-button-next').click()
        //select date as 6th of October (in this case)
        cy.get('.month-9.year-2019 > .days > tbody > :nth-child(2) > .day-6').click()
        //wait for the bis datapicker to open and select the to date as 13th October
        cy.get('.month-9.year-2019 > .days > tbody > :nth-child(3) > .day-13').click()
        //verify default selection for pax
        cy.get('#travellerSummary').should('have.value', '2 Erwachsene, 0 Kinder')
        //scroll to the top (for better visibility)
        cy.scrollTo('top')
        //trigger search with criteria - 
        //home page > location - Sizilien > date range - von 6th October, bis 13th October, default selection for 2 pax
        cy.get('#submit').click()
        })

    // this test should fail due to cypress encountering an uncaught exception
    it("Change dates in filter criteria on order selection screen", ()=>{
        cy.on('uncaught:exception', (err, runnable) =>{
            done()
            return false
        });
        // verify if the filter is preserved
        cy.get('.standard-version > #idestflat').should('have.value','Sizilien')
        //set new date value, date from as 13th of October
        cy.get('.datepicker-input-wrapper-start > .datepicker-trigger').click()
        cy.get('.month-9.year-2019 > .days > tbody > :nth-child(3) > .day-13').click()
        //set date to value as 20th of October
        cy.get('.month-9.year-2019 > .days > tbody > :nth-child(4) > .day-20').click()
        //submit
        cy.get('#submit').click()
        })

    //selecting the best offering
    it('select filter 4 stars rating and best review', ()=>{
        //verify the search criteria remains unchanged
        cy.get('.standard-version > #idestflat').should('have.value','Sizilien')
        //Click on category 4 and more
        cy.get('#optCategory2').click()
        //click on best rating
        cy.get('[for="5 Punkte"] > svg').click()
    })

    it('switch sorting to price descending', ()=>{
        cy.on('uncaught:exception', (err, runnable) =>{
            done()
            return false  
        });
        //click on sorting options dropdown
        cy.get('#hotelsorting', {timeout: 30000}).select('Höchster Preis').should('have.value','price_desc')
        //scroll to bottom to populate all results
        cy.scrollTo("bottom")
        //verify price vise sorting
        var amt = [];
        var stamt = [];
        cy.get('.content > .priceBox > .price-wrapper > .js-ibe4 > div > .price').then(elems => {
            var texts = [...elems].map(el => el.textContent.trim());
            cy.log(texts);
            amt = [];
            for(var i in texts){
                i.trim()
                i.replace('€','')
                amt.push(i)
            }
            cy.log(amt)
            stamt = amt.sort(function(a, b){return b-a})
            cy.expect(amt).to.equal(stamt)
        })
        
    })
    it('Select most expensive hotel and go to offers.', () =>{
        //select the first listing, as price is sorted in descending order
        cy.get('.content > .priceBox > :nth-child(3) > .js-ibe4')
        .then((href) => {
          cy.visit(href)
        })
    })
    it('Provide time range for flight arival and departure', () =>{

    })
})