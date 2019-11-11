export class Relatorio {
    title: string;
    municipio: string;
    comarca: string;
    fazenda: string;
    topico: string[];
    corpo: string[];
    images: string[];
    areaDesmatada: AreaDesmatada[];
}

export class AreaDesmatada {
    area: string;
    deter: string;
    prodes: string;
}