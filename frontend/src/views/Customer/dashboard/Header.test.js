import React from 'react';
import {render, screen} from '@testing-library/react';
import Header from './Header';

it('should take a snapshot', () => {
    const { asFragment } = render(<Header />)
    
    expect(asFragment(<Header />)).toMatchSnapshot()
   });