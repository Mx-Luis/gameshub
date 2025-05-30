/*
Respuesta 4.1
1-
2-juegos-data.service.ts
3-app.config.ts
Respuesta 4.2
1-
2-
*/
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { Juego } from '../../interfaces/juego.interface';
import { JuegosDataService } from '../../services/juegos-data.service';
import { TarjetaJuegoComponent } from '../tarjeta-juego/tarjeta-juego.component';
import { FiltrosComponent } from '../filtros/filtros.component';
import { CategoriasService } from '../../services/categorias.service';



@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule, RouterLink, FormsModule, TarjetaJuegoComponent, FiltrosComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  juegosPopulares$!: Observable<Juego[]>;
    juegosRecientes$!: Observable<Juego[]>;

    totalJuegos$!: Observable<number>;
  juegos$!: Observable<Juego[]>;
  juegosFiltrados$!: Observable<Juego[]>;

  nOnInit(): void {
    this.juegosPopulares$ = this.juegosService.obtenerJuegosPopulares(1);
        this.juegosRecientes$ = this.juegosService.obtenerJuegosRecientes(3);

  }
  
  private filtrosSubject = new BehaviorSubject<any>({
    busqueda: '',
    categoria: '',
    plataforma: '',
    precio: '',
    rating: 0
  });
  
  filtros$ = this.filtrosSubject.asObservable();
  terminoBusqueda = '';
  categoriaSeleccionada = '';
  mostrandoResultados = 0;
  
  constructor(
    private juegosService: JuegosDataService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.juegos$ = this.juegosService.obtenerJuegos();
    
    // Combinar juegos con filtros
    this.juegosFiltrados$ = combineLatest([
      this.juegos$,
      this.filtros$
    ]).pipe(
      map(([juegos, filtros]) => {
        let resultado = juegos;
        
        // Filtro por búsqueda
        if (filtros.busqueda) {
          resultado = resultado.filter(juego =>
            juego.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            juego.desarrollador.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            juego.categoria.toLowerCase().includes(filtros.busqueda.toLowerCase())
          );
        }
        
        // Filtro por categoría
        if (filtros.categoria) {
          resultado = resultado.filter(juego =>
            juego.categoria.toLowerCase() === filtros.categoria.toLowerCase()
          );
        }
        
        // Filtro por plataforma
        if (filtros.plataforma) {
          resultado = resultado.filter(juego =>
            juego.plataformas.includes(filtros.plataforma)
          );
        }
        
        // Filtro por precio
        if (filtros.precio === 'gratis') {
          resultado = resultado.filter(juego => juego.esGratis);
        } else if (filtros.precio === 'pago') {
          resultado = resultado.filter(juego => !juego.esGratis);
        }
        
        // Filtro por rating
        if (filtros.rating > 0) {
          resultado = resultado.filter(juego => juego.rating >= filtros.rating);
        }
        
        this.mostrandoResultados = resultado.length;
        return resultado;
      })
    );
  }
 
   
}


