namespace companyAction;

using {
    managed,
    cuid
} from '@sap/cds/common';

entity CompanyCodes {
    key CompanyCode : String(5);
        CompanyStatus : Composition of many Status
                            on CompanyStatus.CompanyToday = $self;
}

entity CompanyCodesToday {
    key ID            : Integer;
        CompanyCode   : Association to CompanyCodes;
        Ready         : Boolean;
        Date          : Date;
}

@cds.autoexpose
entity Status : cuid, managed {
    Status       : String(15);
    CompanyToday : Association to CompanyCodes;
}
