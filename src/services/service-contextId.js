import React from 'react';

const { Provider: SwapiServiceProvider, Consumer: SwapiServiceConsumer } = React.createContext({
  guestSessionId: null,
});

export { SwapiServiceProvider, SwapiServiceConsumer };
