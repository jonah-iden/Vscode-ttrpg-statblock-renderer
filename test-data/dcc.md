# DCC Mobs

```dcc-mob
name: Hooligans
rank: Mob
size: Medium
type: Avian/Humanoid Hybrid
hp: [2, 2]
level: 2
surprise: 11+F
evade: 11+F
move: 25+S
dr: 1
str: 4
int: 1
con: 3
dex: 2
cha: 1

attacks:
  Baseballschläger: { hit: 12+F, damage: 1d8+2 Bludgeoning, range: 5ft }
  Schnabel-Biss: { hit: 12+F, damage: 1d4+2 Piercing, range: 5ft }

abilities:
  Aggressives Zischen (Aura): >
    Jede Kreatur, die ihren Zug innerhalb von 5ft neben einem Hooligan startet,
    muss einen Dex/Evade-Vergleich schaffen oder verliert 1 Positionierungsfeld
    durch pure Verwirrung und Lärm.
  Rudel-Aggro: >
    Erhält +1 auf Trefferwürfe für jeden weiteren Hooligan innerhalb von 10ft
    um das Ziel.
```

```dcc-mob
name: Hooligans Pyromane
rank: Mob
size: Medium
type: Avian/Humanoid Hybrid
hp: 3x2
level: 3
surprise: 11+F
evade: 12+F
move: 20+S
dr: 1
str: 2
int: 2
con: 3
dex: 5
cha: 2

attacks:
  Improvisierter Molotow:
    hit: 12+F
    damage: 1d4+2 Fire
    range: 20ft
    note: >
      Trifft das Ziel und erzeugt ein "Brennendes Feld" (5ft Radius,
      1d4 Feuerschaden beim Betreten).
  Bengalo-Stich: { hit: 12+F, damage: 1d4+1 Fire + Blinding, range: 5ft }

abilities:
  Pyro-Panik: >
    Wenn der Pyro-Hooligan stirbt, lässt er seinen Molotow fallen
    und setzt sein eigenes Feld in Brand.
```

```dcc-mob
name: Hooligans Ultra
title: Nachbarschafts-Boss (Neighborhood Boss)
rank: Boss
size: Large
type: Avian/Humanoid Hybrid
hp: 11x4
level: 6
surprise: 13+F
evade: 13+F
move: 20+S
dr: 2
str: 9
int: 6
con: 10
dex: 8
cha: 10

attacks:
  Eiserne Kette: { hit: 13+F, damage: 2d6+3 Bludgeoning, range: 10ft (Reach) }
  Tackle: { hit: 13+F, damage: 1d6+3 Bludgeoning + Knockback }
  Schnabel-Nuss: { hit: 13+F, damage: 1d6+3 Bludgeoning }

abilities:
  Fangesang der Schande (Schrei): >
    Einmal pro Kampf. Alle Crawler im Umkreis von 30ft müssen einen
    Int/Mental-Check bestehen. Bei Fehlschlag erhalten sie den Zustand
    "Enraged" bis zum Ende der nächsten Runde (dürfen nur Angriffs- und
    Bewegungs-Aktionen ausführen).
  Ultra-Motivation: Verbündete Hooligans im Umkreis von 15ft bekommen +1 DR.

notes: >
  Als Boss hat der Ultra 1 Aktion pro Crawler in der Gruppe (auch wenn ein
  Crawler während des Kampfes stirbt). Die Hooligans sind seine Leibwache.
```

```dcc-mob
name: Broken example (shows the error display)
hp: [2, 2
```
