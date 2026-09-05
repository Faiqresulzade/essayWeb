import type { GroupAnalytics, OverviewAnalytics, StudentAnalytics } from '../models/analytics';
import type {
  Essay,
  EssayHistoryPage,
  EssayHistoryQuery,
  EvaluateGrade9EssayCommand,
  EvaluateTextEssayCommand,
} from '../models/essay';
import type { CreateLessonCommand, Lesson, LessonLibraryQuery, LessonPage } from '../models/lesson';
import type { Group, GroupDraft, Student, StudentDraft } from '../models/student';
import type { DailyUsage, PlanInfo, Subscription } from '../models/subscription';
import type { AuthSession, UserProfile } from '../models/user';

/** Uzun sürən AI sorğuları üçün ləğvetmə dəstəyi. */
export interface RequestOptions {
  readonly signal?: AbortSignal;
}

export interface RegisterCommand {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly acceptTerms: boolean;
  readonly referralCode?: string;
}

export interface LoginCommand {
  readonly email: string;
  readonly password: string;
}

export interface ResetPasswordCommand {
  readonly email: string;
  readonly token: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

export interface ChangePasswordCommand {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

export interface AuthRepository {
  register(command: RegisterCommand): Promise<void>;
  login(command: LoginCommand): Promise<AuthSession>;
  refresh(refreshToken: string): Promise<AuthSession>;
  logout(refreshToken: string): Promise<void>;
  forgotPassword(email: string): Promise<string>;
  resetPassword(command: ResetPasswordCommand): Promise<void>;
  getProfile(): Promise<UserProfile>;
}

export interface AccountRepository {
  updateFullName(fullName: string): Promise<void>;
  changePassword(command: ChangePasswordCommand): Promise<void>;
  deleteAccount(): Promise<void>;
}

export interface EssayRepository {
  evaluateText(command: EvaluateTextEssayCommand, options?: RequestOptions): Promise<Essay>;
  evaluateGrade9(command: EvaluateGrade9EssayCommand, options?: RequestOptions): Promise<Essay>;
  /** Şəkildən mətn oxuyur; qiymətləndirmir və gündəlik sayğacı artırmır. */
  recognizeText(image: File, options?: RequestOptions): Promise<string>;
  getHistory(query: EssayHistoryQuery, options?: RequestOptions): Promise<EssayHistoryPage>;
  getById(id: number, options?: RequestOptions): Promise<Essay>;
  remove(id: number): Promise<void>;
  clearHistory(): Promise<number>;
}

export interface LessonRepository {
  /** Mövzu kitabxanada varsa mövcud dərsi qaytarır (limit xərclənmir). */
  createOrOpen(command: CreateLessonCommand, options?: RequestOptions): Promise<Lesson>;
  getLibrary(query: LessonLibraryQuery, options?: RequestOptions): Promise<LessonPage>;
  getById(id: number, options?: RequestOptions): Promise<Lesson>;
}

export interface GroupRepository {
  list(options?: RequestOptions): Promise<Group[]>;
  create(draft: GroupDraft): Promise<Group>;
  rename(id: number, draft: GroupDraft): Promise<void>;
  remove(id: number): Promise<void>;
  addStudent(groupId: number, draft: StudentDraft): Promise<Student>;
}

export interface StudentRepository {
  list(groupId?: number, options?: RequestOptions): Promise<Student[]>;
  getById(id: number, options?: RequestOptions): Promise<Student>;
  update(id: number, draft: StudentDraft): Promise<void>;
  remove(id: number): Promise<void>;
}

export interface AnalyticsRepository {
  getOverview(options?: RequestOptions): Promise<OverviewAnalytics>;
  getGroup(groupId: number, options?: RequestOptions): Promise<GroupAnalytics>;
  getStudent(studentId: number, options?: RequestOptions): Promise<StudentAnalytics>;
}

export interface SubscriptionRepository {
  getPlans(options?: RequestOptions): Promise<PlanInfo[]>;
  getCurrent(options?: RequestOptions): Promise<Subscription>;
  getUsage(options?: RequestOptions): Promise<DailyUsage>;
  cancel(): Promise<Subscription>;
}

/** Bütün repository-lərin toplusu — DI konteyneri bunu təqdim edir. */
export interface Repositories {
  readonly auth: AuthRepository;
  readonly account: AccountRepository;
  readonly essay: EssayRepository;
  readonly lesson: LessonRepository;
  readonly group: GroupRepository;
  readonly student: StudentRepository;
  readonly analytics: AnalyticsRepository;
  readonly subscription: SubscriptionRepository;
}
