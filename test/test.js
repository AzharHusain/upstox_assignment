var ss = require('../search_store/search_store');
var expect = require('chai').expect;


/**
 * Describe test suite
 */
describe('Test cases for result ranking/scoring method', function() {

    /**
     * First test case when name and search term are equal
     */
    it('Score should be 10 when name and search term are equal', function() {
        const searchHandler = new ss.SearchStore();
        const score = searchHandler._testScore('azhar husain siddiqui', 'Azhar Husain Siddiqui')
        expect(score).to.equal(10);
    });

    /**
     * Second test when search term is substring of name
     */
    it('Score should be less than 10 when name and search term are not same', function() {
        const searchHandler = new ss.SearchStore();
        const score = searchHandler._testScore('skaj', 'Skajo Manual');
        //work around for less than check
        expect(score).to.be.at.most(9.9999);
    });
  });