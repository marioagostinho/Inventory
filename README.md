[![LinkedIn][linkedin-shield]][linkedin-url] [![Trello][trello-icon]][trello-url]

# Inventory

<br />

<p align="center">
  <img src="https://github.com/marioagostinho/Inventory/blob/master/InventoryLogo.PNG" />
</p>

<br />

This project was build as a **task work** for [FELFEL](https://felfel.ch/en) with the goal of implementing a simple inventory.

<br />

### Built With

* .NET 7.0
* GraphQL (Hot Chocolate)
* Entity Framework Core
* EF Core InMemory
* NUnit
* React 18
* GraphQL Apollo Client
* Bootstrap 5

<br />

## Getting Started

### Prerequisites

You will need to have the **.NET SDK 7** installed
```sh
winget install Microsoft.DotNet.SDK.7
 ```
and **yarn**
```sh
npm install --global yarn
```

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/marioagostinho/Inventory.git
   ```
2. From the cloned project go to **client** folder
   ```sh
   cd .\Inventory\client\
   ```
3. Install yarn packages
   ```sh
   yarn install
   ```

### Starting

1. Start the **API** (will run on `http://localhost:5037/graphql`)
   ```sh
   cd ..\api
   dotnet run
   ```
2. Start client:
   ```sh
   cd ..\client
   yarn start
   ```

<br />

and voilà the application is ready to be used :slightly_smiling_face:

<br />

## Roadmap

- [ ] Add product page
- [ ] Add product's batches in the product page
- [ ] Add client forms validation
- [ ] Add notification after adding/editing or deleting something
- [ ] Multi-language support?
    - [ ] German
    - [ ] French
    - [ ] Italian


<!-- VARS -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=0077b5
[linkedin-url]: https://www.linkedin.com/in/m%C3%A1rio-agostinho-5b364912b/
[trello-icon]: https://img.shields.io/badge/-Trello-black.svg?style=for-the-badge&logo=trello&colorB=0052CC
[trello-url]: https://trello.com/b/Y2SHQMln/inventory
