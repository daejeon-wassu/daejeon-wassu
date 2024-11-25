<div align="center">
      <img src='readmeImage/title.png' width="70%">

 <h1>대전왔슈</h1>

 <h3>대전 여행 서비스, 대전을 담다, 대전왔슈</h3>
<p>2024.10.00 ~ 2024.11.19</p>
</div>

## 목차

- [목차](#목차)
- [서비스 개요](#서비스-개요)
- [팀원 소개](#팀원-소개)
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [명세서](#명세서)
- [ERD](#erd)
- [시스템 아키텍쳐](#시스템-아키텍쳐)
- [서비스 실사용 화면](#서비스-실사용-화면)
  - [1. 메인 페이지](#1-메인-페이지)
  - [2. 일정 계획 페이지](#2-일정-계획-페이지)
    - [2-1. 여행 계획 홈 메뉴](#2-1-여행-계획-홈-메뉴)
    - [2-2. 여행 계획 지도 메뉴](#2-2-여행-계획-지도-메뉴)
    - [2-3. 여행 계획 일정 메뉴](#2-3-여행-계획-일정-메뉴)
  - [3. 지난 계획 페이지](#3-지난-계획-페이지)
  - [4. 여행지 페이지](#4-여행지-페이지)
    - [5. 공통화면](#5-공통화면)

## 서비스 개요

```
대전 여행을 더욱 즐겁게, 대전왔슈

대전의 유명 관광 명소들을 추천받고 검색하여 기본 정보를 제공받을 수 있습니다.
유명 관광 명소들을 기반으로 다양한 프리셋 코스를 제공합니다.
각 코스에서 등장하는 각양각색의 왓슈몬을 잡아 도감을 채울 수 있습니다.
부루마블 제공받은 코스를 친구들과 함께 즐길 수 있습니다.
관광 명소에 대한 사용자들의 후기를 볼 수 있습니다.
커뮤니티에서 자신의 경험을 공유하고 대전에 대한 더욱 다양한 정보를 얻을 수 있습니다.
```

## 팀원 소개

<div align="center">
      <img src='readmeImage/position.PNG'>
      <table>
      <tr>
        <td align="center" width="5%">GitHub</td>
        <td align="center" width="15%"><a href="https://github.com/suehwanBoo">장현수</a></td>
        <td align="center" width="15%"><a href="https://github.com/hyunjiihye">강병규</td>
        <td align="center" width="15%"><a href="https://github.com/lhgeer7485">김해수</td>
        <td align="center" width="15%"><a href="https://github.com/YangGeoun">이정원</td>
        <td align="center" width="15%"><a href="https://github.com/sondongcheon">임용구</td>
        <td align="center" width="15%"><a href="https://github.com/hyyoom">정두홍</td>
        </tr>
      </table>
</div>

## 기술 스택

<div align="middle">

**| FrontEnd |**

<img src="https://img.shields.io/badge/nextjs-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
<img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-FFE249?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white">
<img src="https://img.shields.io/badge/Yjs-30BCED?style=for-the-badge&logo=Yjs&logoColor=white">
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white">
<img src="https://img.shields.io/badge/zustand-1F4ECF?style=for-the-badge&logo=zustand&logoColor=white">
<img src="https://img.shields.io/badge/lottie-04d1c1?style=for-the-badge">
<img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">

<br>

**Language |** HTML5, CSS3, JavaScript, node.js(v20.12.2)

**Framework |** Next.js(v14.2.2), Zustand(v4.5.2)

**Library |** eslint(v8.57.0), Yjs(v13.6.14), prettier(v3.2.5), Lottie(v2.0.0), Axios(v1.6.7), peer.js(v1.5.2)

</div>

<br>
<br>
<div align="middle">

**| BackEnd |**

<img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white"> 
<img src="https://img.shields.io/badge/spring boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/SpringWebClient-6DB33F?style=for-the-badge&logo=SpringWebClient&logoColor=white">
<img src="https://img.shields.io/badge/gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white">
<img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white">
<img src="https://img.shields.io/badge/JPA Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white">
<img src="https://img.shields.io/badge/fastapi-009688?style=for-the-badge&logo=fastapi&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">

</br>

**Language |** Java 21, Python (v3.9.13)

**Framework |** Spring Boot(v3.2.4), express(v4.19.2), fastAPI(v0.111.0)

**DB Connection(ORM) |** Spring Data JPA

**Build Tool |** Gradle(v8.5.0)

</div>

<br>
<br>
<div align="middle">

**| Infra |**

<img src="https://img.shields.io/badge/jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white"> 
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> 
<img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">

<br>

**DB |** MySQL(v8.0.22), MongoDB(v7.0.8)

**Server |** GitLab, Jenkins(v2.440.3), Docker(v25.0.2), Nginx(v1.18.0)

</div>

## 주요 기능

<table>
<tr>
  <th>분류</th>
  <th>기능</th>
  <th>내용</th>
</tr>
<tr>
  <td> 일정 </td>
  <td>일정 생성</td>
  <td>여행 계획을 세우기 위한 일정을 생성합니다.</td>
</tr>
<tr>
  <td></td>
  <td>장소 추가</td>
  <td>생성된 일정에 원하는 장소를 검색하고, 원하는 날짜에 등록하고, dnd로 장소의 순서를 조정합니다.</td>
</tr>

<tr> 
  <td> 코스 </td>
  <td> 코스 추천</td>
  <td> 대전에서 즐길 수 있는 다양한 여행 테마를 기반으로 코스를 제공합니다.</td>
</tr>
<tr> 
  <td> </td>
  <td> 왓슈몬 챌린지</td>
  <td> 각 코스에서 제공하는 장소들에서 출몰하는 왓슈몬을 AR로 잡아보고 도감에 등록할 수 있습니다.</td>
</tr>

<tr> 
  <td> 관광지</td>
  <td> 관광지 검색 </td>
  <td> 가고싶은 관광지를 검색하거나 추천 관광지 정보를 제공 받습니다. </td>
</tr>
<tr> 
  <td> </td>
  <td> 도장 </td>
  <td> 해당 관광지에 방문 했다면 위치 기반으로 방문 인증 도장을 받을 수 있습니다. </td>
</tr>
<tr> 
  <td> </td>
  <td> 방문 후기 </td>
  <td> 관광지에 대한 후기를 남겨 사용자들의 경험을 공유하고 함께 이야기 할 수 있습니다. </td>
</tr>

<tr> 
  <td> 부루마블</td>
  <td> 혼자 도슈 </td>
  <td> 기존 부루마블의 룰을 기반으로 대전의 다양한 장소를 더욱 재미있게 즐길 수 있습니다.</td>
</tr>
<tr> 
  <td> </td>
  <td> 같이 도슈 </td>
  <td> 친구와 함께 즐기며 더욱 즐겁게 대전을 여행할 수 있습니다. </td>
</tr>

</table>

## 명세서

<div align="start">

- <a href='https://tested-roquefort-da8.notion.site/e0ed30ab70594efe87bcc2bd7dd66f1b?pvs=4'>기능 명세서</a>

- <a href='https://tested-roquefort-da8.notion.site/API-f79c44d8a0fd4db2873364bddbed4ba0?pvs=4'>API 명세서</a>

</div>

## ERD

<div  width="70%">
      ![erd](https://github.com/user-attachments/assets/c4cf08c5-7295-4d39-9b3e-dc8a67bd0797)
</div>

## 시스템 아키텍쳐

<div  width="70%">
      <img src='readmeImage/System Architecture.png'>
</div>

## 서비스 실사용 화면

### 1. 랜딩 페이지

<table>
    <tr>
        <th>랜딩 페이지(서비스 처음 화면)</th>
    </tr>
    <tr>
        <td><img src='https://github.com/user-attachments/assets/8faabbe8-6d05-4c92-a7fa-9803f8e2a9d8' /></td>
    </tr>
</table>
<br>

### 2. 메인 페이지

<table>
    <tr>
        <th>메인 페이지</th>
    </tr>
    <tr>
        <td>![6](https://github.com/user-attachments/assets/95b394c8-193b-4496-9e11-50c7c629bb8a)</td>
    </tr>
</table>
<br>

<table>
    <tr>
        <th>관광지 검색</th>
    </tr>
    <tr>
        <td>![5](https://github.com/user-attachments/assets/698a3d1c-4939-4834-b6a4-754b20329933)</td>
    </tr>
</table>

### 3. 커뮤니티 페이지

<table>
    <tr>
        <th>커뮤니티 페이지</th>
    </tr>
    <tr>
        <td>![4](https://github.com/user-attachments/assets/049b90e3-86eb-4574-b71d-48f932b09927)</td>
    </tr>
</table>
<br>

<table>
    <tr>
        <th>게시글 작성 페이지</th>
    </tr>
    <tr>
        <td>![3](https://github.com/user-attachments/assets/d432ac93-e377-471b-9971-a5453a9f7154)</td>
    </tr>
</table>
<br>

### 4. 코스 페이지

<table>
    <tr>
        <th>코스 상세 페이지</th>
    </tr>
    <tr>
        <td>![2](https://github.com/user-attachments/assets/a553abc8-034a-4c93-a202-2d11859b6fca)</td>
    </tr>
</table>
<br>

<table>
    <tr>
        <th>관광지 상세 페이지</th>
    </tr>
    <tr>
        <td>![1](https://github.com/user-attachments/assets/3fb22b20-18fa-4437-88c8-8e7b95227427)</td>
    </tr>
</table>
<br>
