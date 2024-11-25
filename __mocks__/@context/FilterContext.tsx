export const useFiltersContext = jest.fn(() => ({
    activePeriod: 'month',
    filters: {
      viewAll: true,
      paymentTerminal: true,
      linkPayment: true,
    },
    setActivePeriod: jest.fn(),
    setFilters: jest.fn(),
  }));