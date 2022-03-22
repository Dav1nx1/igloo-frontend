import React from "react";
// Using render and screen from test-utils.js instead of
// @testing-library/react
import { render, screen, fireEvent, getByText } from '@testing-library/react'
import Table from '../pages/components/Table'

describe('Table Section tests', () => {
    beforeEach(() => render(<Table />))


    it("should render table", () => {
		const table = screen.getByTestId('table-section')

		expect(table).toBeInTheDocument
	})


	it("should render searchBox", () => {
		const searchBox = screen.getByTestId('search-section')

		expect(searchBox).toBeInTheDocument
	})

    it.todo('pagination page change calling method related')

    it.todo('search box capture value and print')

}) 