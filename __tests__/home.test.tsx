import React from "react";
// Using render and screen from test-utils.js instead of
// @testing-library/react
import { render, screen } from '@testing-library/react'

import HomePage from "../pages/index";

describe("HomePage", () => {
	beforeEach(() => render(<HomePage />))
	
  it("should render the heading", () => {
    const heading = screen.getAllByText(
      "Oscar Corcho - Tech Test Assessment"
    );

    expect(heading).toBeInTheDocument;
  });
});