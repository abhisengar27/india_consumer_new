import { Routes, RouterModule } from "@angular/router";
import { DocumentsForVehicleLoan } from './documentsForVehicleLoan.component';
import { GenericDocumentProofComponent } from './genericDocumentProof.component'

export const DOC_UPLOAD_ROUTES: Routes = [
    { path: '', redirectTo: 'addressProof' },
    { path: 'addressProof', component: GenericDocumentProofComponent, data: { doctype: 'ADDRESS_PROOF' } },
    { path: 'idProof', component: GenericDocumentProofComponent, data: { doctype: 'ID_PROOF' } },
    { path: 'bankStatement', component: GenericDocumentProofComponent, data: { doctype: 'BANK_STATEMENT' } },
    { path: 'incomeProof', component: GenericDocumentProofComponent, data: { doctype: 'INCOME_PROOF' } },
    { path: 'pan', component: GenericDocumentProofComponent, data: { doctype: 'PAN' } },
    { path: 'businessProof', component: GenericDocumentProofComponent, data: { doctype: 'BUSINESS_PROOF' } },
    { path: 'jobProof', component: GenericDocumentProofComponent, data: { doctype: 'JOB_PROOF' } }
]

export const routing = RouterModule.forRoot(DOC_UPLOAD_ROUTES);