package smart_campus_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {"smart_campus_api", "com.smartcampus"})
@EnableMongoRepositories(basePackages = "com.smartcampus.repository")
public class SmartCampusApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartCampusApiApplication.class, args);
	}

}
