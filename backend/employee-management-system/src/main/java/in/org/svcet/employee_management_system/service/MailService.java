package in.org.svcet.employee_management_system.service;

public interface MailService {

    void sendMail(String to, String subject, String body);
}
