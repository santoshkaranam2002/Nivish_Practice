import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadGeoJSON();
  }

  private loadGeoJSON(): void {
    this.http.get('assets/data/geo/India.geojson').subscribe((data: any) => {
      // Log the entire GeoJSON data to inspect the structure
      console.log('Loaded GeoJSON data:', data);

      // Log the features to see how the data is organized
      data.features.forEach((feature: any, index: number) => {
        console.log(`Feature ${index}:`, feature);

        // Check if properties contain any data
        console.log('Feature properties:', feature.properties);

        // Check the geometry data to see if there's any useful information
        console.log('Feature geometry:', feature.geometry);

        // If you expect the state name to be in a specific field, try logging it
        // Replace 'NAME_1' with the appropriate property name once you identify it
        console.log('State name:', feature.properties ? feature.properties.NAME_1 : 'No properties available');
      });

      // Proceed with the map rendering after checking the data structure
      this.renderMap(data);
    });
  }

  private renderMap(stateData: any): void {
    // Log the features of the GeoJSON to verify the structure
    console.log('State features:', stateData.features);
  }
}
