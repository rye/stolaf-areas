import {filterByQualification} from '../lib/filter-by-where-clause'

describe('filterByQualification', () => {
    it('filters an array of courses by a qualification', () => {
        const basicQualification = {
            $type: 'qualification',
            $key: 'gereqs',
            $value: 'EIN',
            $operator: '$eq',
        }

        const courses = [
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['ASIAN'], number: 275, year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
        ]

        expect(filterByQualification(courses, basicQualification)).to.deep.equal([
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
        ])
    })

    it('filters an array based on a nested where-query with the max function', () => {
        const advancedQualificationMax = {
            $type: 'qualification',
            $key: 'year',
            $operator: '$lte',
            $value: {
                $name: 'max',
                $prop: 'year',
                $type: 'function',
                $where: {
                    $type: 'qualification',
                    $key: 'gereqs',
                    $operator: '$eq',
                    $value: 'BTS-T',
                },
            },
        }

        const courses = [
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['ASIAN'], number: 275, year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
        ]

        expect(filterByQualification(courses, advancedQualificationMax)).to.deep.equal([
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
        ])
    })

    it('filters an array based on a nested where-query with the min function', () => {
        const advancedQualificationMin = {
            $type: 'qualification',
            $key: 'year',
            $operator: '$lte',
            $value: {
                $name: 'min',
                $prop: 'year',
                $type: 'function',
                $where: {
                    $type: 'qualification',
                    $key: 'gereqs',
                    $operator: '$eq',
                    $value: 'BTS-T',
                },
            },
        }

        const courses = [
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['ASIAN'], number: 275, year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
        ]

        expect(filterByQualification(courses, advancedQualificationMin)).to.deep.equal([
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
        ])
    })

    it('must use either min or max as a function for a nested where-query', () => {
        const advancedQualificationBad = {
            $type: 'qualification',
            $key: 'year',
            $operator: '$lte',
            $value: {
                $name: 'not-max-nor-min',
                $prop: 'year',
                $type: 'function',
                $where: {
                    $type: 'qualification',
                    $key: 'gereqs',
                    $operator: '$eq',
                    $value: 'BTS-T',
                },
            },
        }

        const courses = [
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['ASIAN'], number: 275, year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
        ]

        expect(() => filterByQualification(courses, advancedQualificationBad))
            .to.throw(ReferenceError)
    })

    it('must specify a function when utilizing a nested where-query', () => {
        const advancedQualificationBad = {
            $type: 'qualification',
            $key: 'year',
            $operator: '$lte',
            $value: {
                $name: 'max',
                $prop: 'year',
                $type: '',
                $where: {
                    $type: 'qualification',
                    $key: 'gereqs',
                    $operator: '$eq',
                    $value: 'BTS-T',
                },
            },
        }

        const courses = [
            {department: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {department: ['ASIAN'], number: 275, year: 2016},
            {department: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
            {department: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {department: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
        ]

        expect(() => filterByQualification(courses, advancedQualificationBad))
            .to.throw(TypeError)
    })
})
