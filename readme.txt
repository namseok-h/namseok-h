회원제 게시판 프로젝트
    기능
    1. 회원가입
    2. 로그인 / 로그아웃
    3. 글 작성
    4. 글 수정 / 글 삭제
    5. 회원 정보 수정
    5. 비밀번호 수정

프론트엔드 : React
백엔드 : Spring boot
DB : MySQL
DB연동 : Spring JPA

추가 패키지
1. font awesome
yarn add @fortawesome/react-fontawesome@latest
yarn add @fortawesome/fontawesome-svg-core
yarn add @fortawesome/free-solid-svg-icons
2. node-sass
3. react-router-dom
4. classnames
5. axios
6. moment
7. react-hook-form
8. react-select

DB 테이블
- member : 회원 정보 저장(id, password, name, email, phone)
- board : 게시글 저장(글 번호, 제목, 작성자, 내용, 작성일)
- boradfile : 게시글 첨부 파일 저장(번호, 글 번호, 원래 이름, 변경 이름)

JPA(Java Persistence API) - (Spring 쪽)
    자바 프로그램에서 관계형 데이터베이스를 사용하는 방식을 정의한 인터페이스 API

    관계형 DB(Relationship Database, RDB)
        테이블과 테이블 간의 관계로 데이터를 저장/관리하는 방식의 데이터베이스.
        - MySQL, Oracle, MariaDB 등

    Hibernate : JPA의 구현체(클래스)
        - JPA는 인터페이스, Hibernate는 구현 클래스

    Spring Data JPA : JPA와 Hibernate를 사용하기 쉽게 만든 Spring 라이브러리.

    JPA의 DB 처리 방식
        Entity 클래스를 구현하면 해당 클래스에서 지정한 이름들로 테이블 명과 컬럼명을 지정하여
        DB 테이블을 자동으로 생성하며, CRUD 작업에 대한 메소드를 제공.
        1 테이블 = 1 Entity

        CRUD를 위한 JPA Query Method
            메소드 이름으로 SQL 쿼리문을 자동으로 생성하여 처리하는 방식의 메소드.
            (+ SQL 쿼리문도 사용할 수 있다.)
            
JPA 관련 설정(JPA 초기화 전략) - application.properties
    - spring.jpa.database : 사용할 DBMS을 지정.
    - spring.jpa.database-platform : 각 DBMS에 맞게
            SQL을 생성하도록 도와주는 dialect(방언) 객체를 지정.
    - spring.jpa.generate-ddl : DDL 생성 시 DB 고유의 기능을
            사용하는지에 대한 유무 체크 -> false
            (프로젝트에서 설정한 데로 처리해야 하기 때문에.)
    - spring.jpa.hibernate.ddl-auto : create table 관련 설정.
        none : 아무것도 하지 않는다.(DB에 테이블을 따로 작업)
        create : 서버프로그램이 실행될 때 해당 테이블을 drop(삭제)하고
            새 테이블을 생성.
        create-drop : 프로그램가 실행될 때 해당 테이블을 재생성,
            프로그램이 종료될 때 해당 테이블을 삭제.
        update : 프로그램이 실행될 때 테이블이 없으면 생성,
            또는 Entity 클래스를 변경하면 변경된 내용을 
            테이블에 반영.
            Entity 클래스가 변경되지 않으면, 기존 테이블을 유지.
        validate : Entity 클래스와 테이블이 잘 매핑되어 있는지 확인하여,
            맞지 않을 때 프로그램을 종료.

JPA Log 설정 - application.properties
- ~.show_sql=true : jpa에서 생성하여 실행하는 SQL 쿼리문을 출력
- ~.format_sql=true : SQL 쿼리문을 보기 좋게 출력
- ~.use-sql-comments=true : SQL 쿼리문에 주석을 달아줌
- ~.org.hibernate.sql=debug : 쿼리 실행 시간까지 같이 출력
- ~.descriptor.sql=trace : 쿼리문에 사용된 파라미터(입력값) 확인            

기존 프로젝트와 달라지는 JPA용 클래스 
    - Entity : DTO와 별개로 작성하는 클래스.
    - Repository : DAO 대신 사용하는 인터페이스.

    1 테이블 : 1 Entity : 1 Repository

JPA Entity
    DB 테이블 생성부터 연계되어 처리되는 클래스. 
    Entity 클래스에서 사용하는 어노테이션
    1) @Entity : 클래스가 entity임을 선언하는 어노테이션.
    2) @Table : DB 테이블의 이름을 지정.
            생략 시 entity의 이름을 그대로 테이블명으로 사용.
            (명시적으로 작성해 주는 것이 좋다.)
            테이블명은 스네이크 케이스를 사용하는 것이 좋다.
            (클래스명 - 파스칼 케이스, 테이블명 - 스네이크 케이스)
    3) @Id : 필드(멤버변수)를 테이블의 기본키로 설정.(반드시 작성해야함)
    4) @GeneratedValue(option) : 자동으로 생성되는 키값에 대한 설정.
            option에 strategy로 생성하는 방식(전략)을 지정.
            MySQL의 Auto-increment는 GenerationType.IDENTITY로 설정.
            (RDB마다 다름. 오라클의 경우 GenerationType.AUTO)
    5) @Column(option) : 필드를 테이블의 컬럼으로 설정.
            (생략 시 필드명을 컬럼명으로)
            컬럼에 대한 여러 설정을 처리.(option)
            - name : 컬럼명. 필드명과 다르게 지정할 경우 사용.
            - nullable : false -> NOT NULL 설정. 생략시 NULL 허용.
            - length : 컬럼의 길이 지정.
            - columnDefinition = "DATE DEFAULT CURRENT_DATE" (데이터 베이스 깔려있는 컴퓨터의 시간 기준.)
              (시간이나 날짜를 기본값으로 처리할 경우 사용.)
    6) @ColumnDefault("값") : (날짜나 시간이 아닌)컬럼에 기본값을 설정.
            문자열로 값을 작성.(정수 컬럼에 0을 기본값으로 설정 -> "0"
    7) @CreationTimestamp/@UpdateTimestamp : insert/update 날짜시간을
            기본값으로 설정.(컬럼의 타입이 datetime일 경우)
            - CreationTimestamp : insert 시만 날짜와 시간 값을 저장.
            - UpdateTimestamp : insert/update 시 날짜와 시간 값을 저장.
    8) @Transient : 데이터베이스와 매핑하지 않는 변수를 작성할 때 사용.
        Entity와 DTO를 통합하여 사용하는 경우 컬럼을 생성하는 변수에는
        @Column을 붙이고, 컬럼을 생성하지 않는 변수에는 이 어노테이션을
        붙인다.

리액트 포트번호 설정
    - package.json 파일에 설정.
    - 설정 위치
    - "scripts" {
        "start": "set PORT=80 && react-scripts start", 
        ...
    }

기능 처리
1. 회원가입(Join)
    1) 아이디 중복 여부 확인 
    2) 회원 정보를 DB에 저장

React useForm
    React hook 중 하나로, form의 유효성 검사, 전송 등의 제어를 돕는 라이브러리.

    기본 사항(객체, 함수)
    - handleSubmit : 전송 시 처리할 함수를 지정.
        유효성 체크 후 지정된 함수를 실행.
    - register : input name 속성 및 onchange 이벤트 관련 속성과 유효성 체크용 패턴,
        에러 발생 시 출력할 메시지 등을 등록하는 객체.
    - watch : useForm으로 받은 데이터 값을 가져오는 함수.
        (register에서 등록한 name 값을 식별자로 활용) / ('비밀번호 확인' 만들 때도 사용함.)
    - formState : 지정된 패턴에 맞지 않는 경우 사용할 'errors' 객체를 지정.

Repository 인터페이스
    DAO 역할을 수행하는 인터페이스.
    JpaRepository(CrudRepository) 인터페이스를 상속받아서 작성.
    작성 시 entity를 지정해야 한다.(1테이블 당 1 Entity, 1 Repository)

    CRUD를 위한 기본 제공 메소드
    1) save(entity) : insert와 update를 처리하는 메소드.
        테이블에 키 필드 값이 존재하는 지에 따라 insert와 update를 구분.
    2) delete(entity)/deleteById(id값) : delete를 처리하는 메소드.
        delete 메소드의 경우 entity로 테이블을 검색하여 데이터가 있는 지의 여부를
        확인하는 코드를 개발자가 작업할 수 있도록 한다.
    3) findAll() : where 절 없이 모든 행을 select하는 메소드.
    4) findById(키변수) : 기본키에 해당하는 행을 select하는 메소드.
            결과값은 Optional 객체로 넘어온다.
            Optional : null을 포함할 수 있는 컨테이너 객체.
                즉, 조회한 데이터가 없어서 처리할 수 없는 
                상황(NullPointException)으로 인한 추가 로직을 
                작성할 필요가 없도록 한 객체.
                데이터가 있으면 데이터를 담고, 없으면 null을 담아줌.
                null을 처리하는 로직도 제공.
                Optional.get() : Optional 객체에 담긴 데이터를 꺼내는 메소드.
                Optional.orElse(null) : Optional 객체에서 처리할 데이터가 
                    있는 경우 데이터를, 없는 경우 null을 반환.
    5) findByXXX 메소드 : Repository에 메소드의 선언부를 작성해서 사용.
        'XXX' 부분에 컬럼명(변수명)을 카멜케이스로 작성.(where에서 사용) /find -> select, By -> where
        예) 연락처 검색 : Member findByMphone(String mphone);
            -> select * from member where mphone='입력한 연락처';
        조건절의 추가 (And, Or)
        예) 이름과 연락처를 함께 검색
            Member findByMnameAndMphone(String mname, String mphone);
            -> select * from member where mname='이름' and mphone='연락처';

            Member findByMnameOrMphone(String mname, String mphone);
            -> select * from member where mname='이름' or mphone='연락처';
        
        Like 조건(다음 중 아무거나 사용)
            findByMnameContains(String mname);
            findByMnameContaining(String mname);
            findByMnameIsContaining(String mname);
            -> select * from member where mname like '%mname%';

        작명 규칙 참고 사이트 : https://zara49.tistory.com/130

    6) JPQL : SQL 형식으로 작성하는 JPA Query 작성 문법
		메소드 위에 @Query 어노테이션을 사용.
		예문 - select m from Member as m where m.mname = :name
        > 대소문자 구분
            - Entity와 변수는 대소문자를 구분
            - JPQL 키워드는 구분하지 않음.(select, from 등)
        > 파라미터 변수를 WHERE 절에 넣을 때
            - @Query 어노테이션에서는 ':식별자'로 작성.
            - @Param("식별자") 어노테이션을 매개변수 앞에 작성.
            sometype method_name(@Param("name") String mname)
        > Entity 이름
            - 테이블 명 대신 entity 명을 사용할 수 있음.
            - @Entity(name = "e_name")으로 설정.
              설정하지 않으면 클래스 이름을 사용.
        > 별칭은 필수!
            - AS는 생략 가능
            - SELECT 절에서 별칭만 사용하면 전체(*)와 같음.

    7) native SQL Query를 사용할 수도 있음.(일반 SQL)
        @Query(value = "SQL 쿼리문", nativeQuery = true)
        method...
        예1)
        @Query(value = "SELECT * FROM member(table) WHERE mname = :name",
                nativeQuery = true)
        DtoClass selectName(@Param("name") String mname);
        예2) Dto와 같은 객체의 데이터를 가져올 때(JPQL도 동일)
        @Query(value = "SELECT * FROM table "   -> 맨끝 공백 넣어줘야됨
                    + "WHERE name = :#{paramDto.name} "   -> 맨끝 공백 넣어줘야됨
                    + "AND age = :#{paramDto.age}",
                    nativeQuery = true)
        Dto selectNameAndAge(@Param("paramDto") Dto dto);


DTO와 Entity간의 관계
    Service를 중심으로 DB <-> Sevice 사이에서는 entity,
    Service <-> Controller 사이에서는 DTO를 사용.
    (entity를 dto처럼 사용하는 것도 가능)

    Service는 중간에 Dto <-> Entity 변환 작업을 처리해야 한다.
    ModelMapper : Dto와 Entity를 자동으로 매핑시켜주는 객체.

    추가 Dependency : ModelMapper
        implementation 'org.modelmapper:modelmapper:3.1.1'

    매핑(변환, 바인딩)
    1) DTO -> ENTITY
        DtoClass dto;
        EntityClass entity = modelMapper
                            .map(dto, EntityClass.class);
    2) ENTITY -> DTO
        EntityClass entity;
        DtoClass dto = modelMapper.map(entity, DtoClass.class);
    3) ENTITY List -> DTO List
        List<EntityClass> eList;
        방식1>
        List<DtoClass> dList = modelMapper.map(eList,
                new TypeToken<List<DtoClass>>(){}.getType());
        방식2>
        List<DtoClass> dList = eList.stream()
                .map(dto -> modelMapper.map(dto, DtoClass.class))
                .collect(Collectors.toList());

로그인/로그아웃 기능 구현
    로그인 정보를 세션에 저장하여 사용자가 사이트 이용 시
    유지되도록 처리한다.
    React에서는 세션에 정보를 저장하기 위한 브라우저 API를
    사용하는데 이것을 sessionStorage라고 한다.

    저장/수정)
    sessionStorage.setItem("식별자", 데이터);

    읽어오기)
    변수 = sessionStorage.getItem("식별자");
    
    삭제)
    sessionStorage.removeItem("식별자");

    로그인 성공 시 로그인한 id값을 저장(유지).
    로그아웃 시 id값을 삭제.

목록 페이지 구현(컴포넌트 작성 요령)
    1. Hook(useNavigate, useState 등)을 먼저 작성.
    2. useEffect(페이지가 처음 보이게될 때 처리할 작업 작성).
        이 때 useEffect에서 사용하게 되는 함수는 useEffect보다
        먼저 작성(목록 가져오기 등).
    3. 그 외 기능 처리(이벤트 처리 등)를 위한 함수 작성.
    4. 게시글 목록 생성을 위한 코드 작성.
    5. return 부분(jsx) - 화면에 보이는 요소들.

useCallback : 함수의 코드를 다시 생성하는 hook.
    함수를 작성 -> 컴파일 -> 실행용 코드가 생성.
    함수 내에서 사용하는 값들이 변경되면 컴파일을 다시해야 함.
    값이 변경되지 않으면 컴파일을 다시할 필요가 없음.

글작성 화면 구현
    Multipart 데이터 전송. Text + Binary(파일)
    -> FormData 객체를 활용.
    
    FormData 객체 : HTML form 태그에 대응하는 react 객체.

    XMLHttpRequest 전송을 위해 설계된 특수한 객체.(비동기 전송을 위한 객체)
    -> ajax를 사용.

참고) XMLHttpRequest는 바닐라 js에서 제공되는 비동기 전송용 객체.
    사용이 어려워서 jQuery의 ajax를 주로 사용.

FormData 객체는 데이터를 Blob 형태로 묶어서 전송.
BLOB(Binary Large Onject) : 대용량의 데이터(파일)를 묶는데 사용하는 객체.

htmlFor 속성 : lable 태그를 react에서 사용할 때 for 속성을 사용하면 error가 발생.
            for 속성을 대체해서 사용하는 jsx 속성.

preventDefault() 함수 : 이벤트 고유의 기능을 막는 함수.
    submit 이벤트를 막을 때 주로 사용.
    submit 이벤트의 고유 기능은 지정된 uri로 input 태그로 
    받은 값을 전달하고, '페이지를 전환'하는 것이다.
    submit 이벤트를 막아야 하는 이유는 지정된 uri가 없고,
    페이지 전환을 하면 안되기 때문이다.
    전송은 axios를 사용.

Back-end(Spring)에서의 Multipart 처리
    @RequestPart 어노테이션을 사용하여 text 데이터와,
    파일 목록을 따로 받는다.
    @RequestPart(options)
        options)
        1) value : 보내는 부분(react)에서 설정한 이름.
            formData("이름", data) 
        2) required : 필수 입력값. true/false로 설정.
                기본값 - true.(true 시 생략 가능)

moment 패키지
    날짜와 시간을 형식을 지정할 때 사용하는 객체 라이브러리.

게시글 수정 작업(React side)
    게시글 상세보기 + 게시글 작성


평가 과제) 현재 프로젝트에 댓글 기능 추가하기.
    1. reply entity를 작성하여 테이블 추가.
        (댓글 번호, 댓글 내용, 작성자 id, 작성일시)
    2. Board.jsx에 댓글 작성 공간 추가
        '작성' 버튼으로 새 댓글을 추가하기
    3. Board.jsx에 댓글 목록 추가
    
My page 만들기
    회원 개인 정보 확인 페이지.
    비밀번호 변경 기능만 처리.

    비밀번호 변경을 위한 메일 인증 기법.

    MIME(Multipurpose Internet Mail Extensions)
        다양한 유형의 정보를 식별하기 위한 표준.
        초기에는 email에 글자만 사용했었는데, 점차적은 
        다양한 미디어 파일(이미지, 사운드, 비디오 등)을
        메일에 포함시켜서 전송하도록 확장. 
        -> 웹 페이지에서도 사용.    