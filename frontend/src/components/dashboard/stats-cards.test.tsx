import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatsCards } from './stats-cards';

describe('StatsCards', () => {
  it('renders all stat cards with given values and titles', () => {
    render(
      React.createElement(StatsCards, {
        totalParceiros: 10,
        confirmados: 5,
        brechosConfirmados: 2,
        djsConfirmados: 1,
        foodConfirmados: 0,
        emNegociacao: 3,
      })
    );

    // Titles
    expect(screen.getByText('Total Parceiros')).toBeInTheDocument();
    expect(screen.getByText('Confirmados')).toBeInTheDocument();
    expect(screen.getByText('Brechós')).toBeInTheDocument();
    expect(screen.getByText('DJs')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Em Negociação')).toBeInTheDocument();

    // Values
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
