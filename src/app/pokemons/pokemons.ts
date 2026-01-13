import { Apollo, gql } from 'apollo-angular';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
    selector: 'pokemons',
    template: `
        @if (loading) {
            <div>Loading...</div>
        }
        @if (error) {
            <div>Error :(</div>
        }
        @if (pokemons) {
            @for (pokemon of pokemons; track $index) {
                <p>{{ pokemon.pokemon_species_id }} : {{ pokemon.name }}</p>
            }
        }
    `,
})
export class Pokemons implements OnInit {
    pokemons: any[] = [];
    loading = true;
    error: any;

    constructor(private readonly apollo: Apollo, private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        console.log("ngOnInit starting");

        this.apollo.watchQuery({
            query: gql`
                {
                    pokemons: pokemonspeciesname(
                        where:  {
                            language_id:  {
                                _eq: 5
                            }
                        }
                        order_by: {pokemon_species_id: asc}
                    ) {
                        name
                        pokemon_species_id
                    }
                }
            `,
        }).valueChanges.subscribe((result: any) => {
            this.pokemons = result.data?.pokemons;
            this.loading = result.loading;
            this.error = result.error;

            this.cdRef.detectChanges();
        });
    }
}