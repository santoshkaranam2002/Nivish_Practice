import { Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { IvinService } from 'src/app/ivin.service';
import { particpationdetails } from '../probite.graphql';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-participation-details',
  templateUrl: './participation-details.component.html',
  styleUrls: ['./participation-details.component.scss']
})
export class ParticipationDetailsComponent {
  @ViewChild('tooltipOverlay') tooltipOverlay!: TemplateRef<any>;
  tooltipDetails: any;
  overlayRef: OverlayRef | null = null;
  state: any;
  election: any;
  year: any;
  constituency: any;
  participationdetails: any[] = [];

  constructor(private ivinservice:IvinService,private apollo:Apollo,private overlay: Overlay, private viewContainerRef: ViewContainerRef){
  }


  ngOnInit(){
    this.participatedetails();
  }


  showTooltip(details: any, event: MouseEvent) {
    this.tooltipDetails = details;

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x: event.clientX, y: event.clientY })
      .withPositions([{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
      }]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const tooltipPortal = new TemplatePortal(this.tooltipOverlay, this.viewContainerRef);
    this.overlayRef.attach(tooltipPortal);
  }

  hideTooltip() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.tooltipDetails = null;
  }



  participatedetails(){
    this.state = this.ivinservice.stateselected;
    this.election = this.ivinservice.electionselected;
    this.year = this.ivinservice.yearselected;
    this.constituency = this.ivinservice.constituencyselected;
    // this.startvalue = this.ivinservice.startvalue;
    // this.endvalue = this.ivinservice.endvalue;
    // this.gender = this.ivinservice.genderselected;
    // this.party = this.ivinservice.partyselected;
    // this.category = this.ivinservice.categoryselected;
    
    console.log("participate ###",this.state);
    console.log("participate ###",this.election);
    console.log("participate ###",this.year);
    console.log("participate ###",this.constituency);
  //   console.log("@@@",this.startvalue);
  //   console.log("@@@",this.endvalue);
  //   console.log("@@@",this.gender);
  //   console.log("@@@",this.party);
  //   console.log("@@@",this.category);

  const totalvariables = {
    election : this.election,
    electionyear : this.year,
    statename : this.state,
    constituency : this.constituency,
  }
  console.log('participationdetails variables',totalvariables);
  this.apollo.use('statusdata').watchQuery({
    query : particpationdetails,
    variables : totalvariables,
  }).valueChanges.subscribe(({data}:any)=>{
    this.participationdetails = data.electionResult;
    console.log(" this.participationdetails", this.participationdetails);

  })

  }

  getTooltipContent(details: any): string {
    const Age = details.Age; 
    const ACCategory = details.ACCategory;
    const Symbol = details.Symbol;
  
    if (details) {
      return `Age: ${Age || 'N/A'}\nACCategory: ${ACCategory || 'Unknown'}\nSymbol: ${Symbol || 'N/A'}`;
    } else {
      return "";
    }
  }
  

  

  downloadAsPDF() {
    const data = document.getElementById('accordionContent'); // Add an ID to the accordion element
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4');
        const position = 10;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('ParticipantList.pdf');
      });
    }
  }
  


}
