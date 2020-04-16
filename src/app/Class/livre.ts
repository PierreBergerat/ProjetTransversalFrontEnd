export class Livre {
    constructor(
        public ISBN: String,
        public titre: String,
        public auteur: String,
        public descritpion: String,
        public genres: Array<String>,
        public edition: String,
        public anneeParution: String,
        public langue: String
    ) { }
}
