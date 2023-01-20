using {companyAction as my} from '../db/schema';

service CompanyStatus {
    entity CompanyCodesToday as projection on my.CompanyCodesToday;
    entity Status as projection on my.Status;
}
