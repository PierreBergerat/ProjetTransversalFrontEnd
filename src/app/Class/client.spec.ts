import { Client } from './client';

describe('Client', () => {
  it('should create an instance', () => {
    expect(new Client("Nom", "Prenom", 0, new Date(), "Nationalite", "Num", "Courriel", "Mdp",0)).toBeTruthy();
  });
});
