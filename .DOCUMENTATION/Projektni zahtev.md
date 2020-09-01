# Aplikacija za kućnu bibiloteku

Aplikacija treba da omogući evidenciju i pregled kućne, privatne, biblioteke. Treba korisniku da omogući da se prijavi sa korisničkim imenom i lozinkom kako bi vršio uređivanje sadržaja, a korisnicima koji nisu prijavljeni omogućava uvid u sadržaj biblioteke. 
Aplikacija prikazuje spisak knjiga koje postoje u kućnoj biblioteci korisnika. Knjige su opisane sledećim podacima: naslov, originalni naslov (ako je prevod), spisak autora (jedan ili više), godina štampe, broj strana, jedinstveni identifikacioni broj štampane publikacije (ako postoji), jezik sadržaja knjige, fotografiju prednje i zadnje korice knjige (nisu obavezne). Za svaku knjigu postoji upisan izdavač. Jedna knjiga ima samo jednog izdavača, a jedan izdavač može imati više knjiga. O izdavaču se čuvaju naziv, grad, država i godina osnivanja. Prijavljeni korisnik može da dodaje i menja podatke o autorima, da dodaje i menja kategorije, da dodaje, menja i briše (sakriva ili prikazuje) knjige. Svaka knjiga, pored navedenih podataka, ima i informaciju o lokaciji gde je smeštena u kućnoj biblioteci. Lokacija se sastoji iz dve komponente: prostorija i polica. Svaka knjiga ima svoj jedinstveni kataloški broj, koji je ujedno i identifikacioni broj zapisa knjige u tabeli knjiga baze podataka aplikacije. 
Korisnici koji nisu prijavljeni mogu da vrše pretragu knjiga po kategorijama, po naslovu (deo naslova), po autoru, po godini izdanja ili kombinovano (detaljna pretraga). Grafički interfejs veb aplikacije treba da bude realizovan u responzivnom dizajnu.

## Ograničenja:
Aplikacija mora da bude realizovana na Node.js platformi korišćenjem Nest.js razvojnog okvira i sav kôd aplikacije treba da bude organizovan prema pravilima MVC arhitekture. Baza podataka mora da bude relaciona i treba koristiti MySQL/MariaDB RDBMS. Sav generisani HTML kôd koji proizvodi aplikacija mora da bude 100% validan, tj. da generisani kôd prođe proveru W3C Validatorom (dopuštena su upozorenja, ali ne i greške). 
Aplikacija može grafički korisnički interfejs da generiše na strani servera, korišćenjem šablona za generisanje HTML koda (proizvoljan templating engine, integrisan sa Nest.js aplikacijom) ili da bude serviran statički deo stranice koji pomoću JavaScript-a dinamički formira komponente na front-end-u, a podatke doprema asinhrono kroz veb servis (API) metode obezbeđene u okviru same aplikacije.
Potrebno je obezbediti određeni stepen provere podataka koji se od korisnika upućuju aplikaciji.

Moguća su četiri sloja zaštite i to: 
* (1) HTML pattern u poljima za unos podataka u formularima; 
* (2) JavaScript validacija vrednosti unetih u polja za unos podataka u formularima na front-end-u; 
* (3) Provera korišćenjem adekvatnih testova ili korišćenjem regularnih izraza na strani servera u Node.js aplikaciji (moguće je i korišćenjem izričitih šema - Schema) 
* (4) provera na nivou baze podataka korišćenjem okidača nad samim tabelama baze podataka.

Neophodno je napisati prateću projektnu dokumentaciju o izradi aplikacije koja sadrži 
* (1) model baze podataka sa detaljnim opisom svih tabela, njihovih polja i relacija; 
* (2) dijagram organizacije elemenata aplikacije sa akcentom na isticanje MVC arhitekture na konkretnom primeru jednog odabranog zahteva, tj. rute/putanje koju Vaša aplikacija obrađuje; 
* (3) popis svih aktivnosti koje su podržane kroz aplikaciju za sve uloge korisnika aplikacije prikazane u obliku Use-Case dijagrama; 
* (4) popis svih kontrolera i njihovih metoda koji obavljaju potrebnu programsku i poslovnu logiku sa ciljem izvršavanja svih predviđenih aktivnosti aplikacije 
* (5) sve ostale elemente dokumentacije predviđene uputstvom za izradu dokumentacije objavljenom na stranici predmeta u sekciji sa predavanja.

Izrada projekta mora da bude sprovođena korišćenjem alata za verziranje koda Git, a kompletan kôd aplikacije bude dostupan na javnom Git repozitorijumu, npr. na besplatnim GitHub ili Bitbucket servisima. Ne može ceo projekat da bude otpremljen u samo nekoliko masovnih Git commit-a, već mora da bude pokazano da je projekat realizovan u kontinuitetu, da su korišćene grane (branching), da je bilo paralelnog rada u više grana koje su spojene (merging) sa ili bez konflikata (conflict resolution).

Autor teme za projektni zadatak: [Milan Tair](https://rs.linkedin.com/in/milantex)

Ova tema je rezervisana od strane studenata sa brojevima indeksâ:
•	2016202154 (primarno odabrao/la)

