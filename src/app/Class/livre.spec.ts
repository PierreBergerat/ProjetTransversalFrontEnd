import { Livre } from './livre';
describe('Livre', () => {
  let livre = new Livre("ISBN","Titre","Auteur","Description",new Array<String>("Genre1"),"Edition","Annee","Langue");
  it('should create an instance', () => {
    expect(livre).toBeTruthy();
  });
  it('should be able to have multiple genras',()=>{
    expect(new Livre("ISBN","Titre","Auteur","Description",new Array<String>("Genre1","Genre2","Genre3"),"Edition","Annee","Langue")).toBeTruthy();
  })
});
