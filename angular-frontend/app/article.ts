import { TreatmentEntity } from './treatment-entity';

export class Article {
    PubDate: string;
    Title: string;
    PMCID: string;
    PMID: string;
    treatmentEntities: TreatmentEntity[];
}
