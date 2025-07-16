
export interface Olay {
    id: string;
    baslik: string;
    tarih: string;
    ozet: string;
    icerik: string;
    gorsel: string;
}

export interface Yorum {
    id: string;
    kullaniciAdi: string;
    metin: string;
    tarih: Date;
}

export interface SohbetMesaji {
    id: string;
    kullaniciAdi: string;
    metin: string;
    tarih: Date;
}

export interface OyunKarti {
    id: number;
    sembol: string;
    eslesti: boolean;
}
