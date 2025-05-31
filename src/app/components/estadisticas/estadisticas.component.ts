/*
Respuesta 4.1
1-juego.interface.ts
2-filtros.component.ts
3-app.config.ts
Respuesta 4.2
1-Porque esta usando componentes standalone.
2-Permite que los componentes del juego se mantengan actualizados.
*/
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosDataService } from '../../services/juegos-data.service';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Juego } from '../../interfaces/juego.interface';
import { Observable } from 'rxjs';
import { Categoria } from '../../interfaces/categoria.interface';
import { RouterLink } from '@angular/router';
import { TarjetaJuegoComponent } from '../tarjeta-juego/tarjeta-juego.component';
import { CategoriasService } from '../../services/categorias.service';


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule,RouterLink,TarjetaJuegoComponent,],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit{
   juegosPopulares$!: Observable<Juego[]>;
   juegos$!: Observable<Juego[]>;
   TotaldeJuegos=0;
   JuegosGratis=0;
   JuegosPago=0;
   Promedio=0;
   mejorjuego?:Juego;
     
     constructor(
      private juegosService: JuegosDataService, 
      private juegosDataService: JuegosDataService,
    private categoriasService: CategoriasService) {}

     ngOnInit(): void{

      this.juegosPopulares$ = this.juegosService.obtenerJuegosPopulares(1);
      this.juegosDataService.obtenerJuegos().subscribe(juegos => {
      this.TotaldeJuegos = juegos.length;
      this.JuegosGratis = juegos.filter(j => j.esGratis).length;
      this.JuegosPago = juegos.filter(j => !j.esGratis).length;
       const precios = juegos.filter(j => !j.esGratis).map(j => j.precio);
      this.Promedio = precios.length > 0? precios.reduce((acc, precio) => acc + precio, 0) / precios.length: 0;
  });
    }
}


