<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<%@ page import ="park.tu.test.Gsonn" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Insert title here</title>
</head>
<body> 
<%
String query = request.getParameter("q"); 
String category = request.getParameter("cat"); 
Gsonn jMaker = new Gsonn();
String json = jMaker.toJson(query, category);
%>

<%=json %>

</body>
</html>